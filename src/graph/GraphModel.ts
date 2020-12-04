import { ContentModel } from './ContentModel'
import { DecoratorModel } from './DecoratorModel'
import { LayoutModel } from './LayoutModel'
import { DecoratedEdge, DecoratedNode } from './types'

export class GraphModel {
  private readonly contentModel: ContentModel
  private readonly decoratorModel: DecoratorModel
  private readonly layoutModel: LayoutModel

  constructor(
    contentModel: ContentModel,
    options: { decoratorModel?: DecoratorModel; layoutModel?: LayoutModel } = {}
  ) {
    this.contentModel = contentModel
    this.decoratorModel =
      options.decoratorModel ?? DecoratorModel.createDefault()
    this.layoutModel = options.layoutModel ?? LayoutModel.createDefault()
  }

  static applyContent(
    graphModel: GraphModel,
    contentModel: ContentModel
  ): GraphModel {
    // add to undo/redo stack here
    return new GraphModel(contentModel, {
      decoratorModel: graphModel.decoratorModel,
      layoutModel: graphModel.layoutModel,
    })
  }

  static applyLayout(
    graphModel: GraphModel,
    layoutModel: LayoutModel
  ): GraphModel {
    return new GraphModel(graphModel.contentModel, {
      decoratorModel: graphModel.decoratorModel,
      layoutModel,
    })
  }

  static createEmpty(): GraphModel {
    return new GraphModel(ContentModel.createEmpty())
  }

  static createWithContent(contentModel: ContentModel): GraphModel {
    return new GraphModel(contentModel)
  }

  getCurrentContent(): ContentModel {
    return this.contentModel
  }

  // get the current fully decorated nodes
  get nodes(): DecoratedNode[] {
    return this.decoratorModel.getDecoratedNodes(
      Object.values(this.contentModel.nodes)
    )
  }

  // get the current fully decorated edges
  get edges(): DecoratedEdge[] {
    return this.decoratorModel.getDecoratedEdges(
      Object.values(this.contentModel.edges)
    )
  }

  getNode(id: string): DecoratedNode {
    return this.decoratorModel.getDecoratedNodes([
      this.contentModel.getNode(id),
    ])[0]
  }

  getCurrentLayout(): LayoutModel {
    return this.layoutModel
  }
}
