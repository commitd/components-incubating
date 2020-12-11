import {
  DecoratedEdge,
  DecoratedNode,
  EdgeDecoration,
  EdgeDecorator,
  ModelEdge,
  ModelNode,
  NodeDecoration,
  NodeDecorator,
} from './types'

export class DecoratorModel {
  static readonly DEFAULT_NODE_DECORATION: NodeDecoration = {
    shape: 'ellipse',
    color: '#FFc526',
    label: '',
    size: 25,
    opacity: 1,
    strokeColor: '#3E3E3E',
    strokeSize: 2,
  }

  static readonly DEFAULT_EDGE_DECORATION: EdgeDecoration = {
    color: '#3E3E3E',
    size: 2,
    label: '',
    sourceArrow: false,
    targetArrow: false,
    opacity: 1,
    style: 'solid',
  }

  static readonly idAsLabelNode: NodeDecorator = (item) => {
    return { label: item.id }
  }

  static readonly idAsLabelNodeEdge: EdgeDecorator = (item) => {
    return { label: item.id }
  }

  static createDefault(): DecoratorModel {
    return new DecoratorModel(
      [DecoratorModel.idAsLabelNode],
      DecoratorModel.DEFAULT_NODE_DECORATION,
      [DecoratorModel.idAsLabelNodeEdge],
      DecoratorModel.DEFAULT_EDGE_DECORATION
    )
  }

  constructor(
    private readonly nodeDecorators: NodeDecorator[],
    private readonly nodeDefaults: NodeDecoration,
    private readonly edgeDecorators: EdgeDecorator[],
    private readonly edgeDefaults: EdgeDecoration
  ) {
    this.nodeDecorators = nodeDecorators
    this.nodeDefaults = nodeDefaults
    this.edgeDecorators = edgeDecorators
    this.edgeDefaults = edgeDefaults
  }

  getDecoratedNodes(modelNodes: ModelNode[]): DecoratedNode[] {
    return Object.values(modelNodes).map((node) => {
      const decor = Object.assign(
        {},
        ...this.nodeDecorators.map((d) => d(node))
      ) as Partial<NodeDecoration>
      return {
        ...this.nodeDefaults,
        ...decor,
        ...node,
      }
    })
  }

  getDecoratedEdges(modelEdges: ModelEdge[]): DecoratedEdge[] {
    return Object.values(modelEdges).map((edge) => {
      const decor = Object.assign(
        this.edgeDecorators.map((d) => d(edge))
      ) as Partial<EdgeDecoration>
      return {
        ...this.edgeDefaults,
        ...decor,
        ...edge,
      }
    })
  }
}
