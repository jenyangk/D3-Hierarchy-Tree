import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HelperMethods } from 'src/app/helpers/helper-methods';
import * as d3 from 'd3';
import { IDimensionsType, ITreeConfig } from '../models/tree.interface';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./tree.component.scss'],
})
export class TreeComponent implements OnChanges, AfterContentInit {
  @Input('data') dataSource!: ITreeConfig;
  @ViewChild('container', { static: true }) containerElement!: ElementRef;

  public title!: string;
  public keys!: any[];
  public maxCount: number = 10;

  // DIV Dimensions
  public dimensions: IDimensionsType;

  // D3 Elements
  public layout: any;
  public rootNode: any;
  public nodes: any;
  public links: any;

  // Dynamic Styling
  public getLinkWeight: Function = d3
    .scaleLinear()
    .domain([1, this.maxCount])
    .range([4, 20]);
  public getLinkColor: Function = d3
    .scaleLinear<string>()
    .domain([1, this.maxCount])
    .range(['#d1c9ca', 'black']);
  public getLinkHighlight: Function = d3.scaleOrdinal(
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    d3.schemeTableau10
  );
  public getNodeColor: Function = d3.scaleOrdinal(
    [0, 1, 2, 3, 4],
    ['#332F30', '#332F30', '#332F30', '#585152', '#E8E8E8']
  );
  public getNodeWeight: Function = d3
    .scaleLinear()
    .domain([1, this.maxCount])
    .range([2, 10]);

  constructor() {
    this.dimensions = {
      marginTop: 20,
      marginRight: 150,
      marginBottom: 20,
      marginLeft: 100,
      height: 1000,
      width: 1000,
    };

    this.dimensions = {
      ...this.dimensions,
      boundedHeight: Math.max(
        this.dimensions.height -
          this.dimensions.marginTop -
          this.dimensions.marginBottom,
        0
      ),
      boundedWidth: Math.max(
        this.dimensions.width -
          this.dimensions.marginLeft -
          this.dimensions.marginRight,
        0
      ),
    };
  }

  private updateNodes(): void {
    if (
      this.dataSource.data &&
      this.dataSource.data.length > 0 &&
      this.keys &&
      this.keys.length > 0
    ) {
      let groups = HelperMethods.rollup(
        this.dataSource.data,
        (v: any) => d3.count(v, (d: any) => 1),
        this.keys.filter((x) => !x.disabled).map((x) => (d: any) => d[x.value])
      );
      
      this.rootNode = d3.hierarchy(groups);
      this.maxCount = this.rootNode.descendants().length as number;
      
      this.rootNode.descendants().forEach((d: any, i: number) => {
        (d.id = i), (d.value = d.sum((d: any) => d[1]).value);
        if (d.children)
          d.sort((a: any, b: any) => a.data[0].localeCompare(b.data[0]));
        d._children = d.children;
        if (d.depth && d.depth !== 0) d.children = null;
      });

      this.updateDimensions();
      this.updateVisual(this.rootNode);
    }
  }

  private updateVisual(source: any): void {
    this.layout(this.rootNode);
    this.nodes = this.rootNode.descendants();
    this.links = this.rootNode.descendants().slice(1);
  }

  public linkGenerator(d: any): string {
    // Use d3.linkHorizontal()
    return (
      'M' +
      d.y +
      ',' +
      d.x +
      'C' +
      (d.y + d.parent.y) / 2 +
      ',' +
      d.x +
      ' ' +
      (d.y + d.parent.y) / 2 +
      ',' +
      d.parent.x +
      ' ' +
      d.parent.y +
      ',' +
      d.parent.x
    );
  }

  public getNodeLabel(d: any): string {
    return (d.data[0] ?? 'Root') + ` (${d.value})`;
  }

  public toggleNode(d: any): void {
    if (d.children) {
      d.children = null;
    } else {
      d.children = d._children;
    }
    this.updateVisual(d);
  }

  public toggleKey(key: any): void {
    key.disabled = !key.disabled;
    this.updateNodes();
  }

  private updateDimensions(): void {
    this.dimensions.width = this.containerElement.nativeElement.offsetWidth;
    this.dimensions.boundedWidth = Math.max(
      this.dimensions.width -
        this.dimensions.marginLeft -
        this.dimensions.marginRight,
      0
    );
    this.layout = d3
      .tree()
      .size([
        this.dimensions.boundedHeight as number,
        this.dimensions.boundedWidth,
      ]);
    this.updateVisual(this.rootNode);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.keys, event.previousIndex, event.currentIndex);
    this.updateNodes();
  }

  @HostListener('window:resize') windowResize() {
    this.updateDimensions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.dataSource) {
      this.title = this.dataSource.title;
      this.keys = this.dataSource.dataKeys.map((x: any) => {
        return { value: x, disabled: false };
      });
      this.updateNodes();
    }
  }

  ngAfterContentInit(): void {
    this.updateDimensions();
  }
}
