import { GraphModel } from '../GraphModel'
import { DecoratedNode, DecoratedEdge, NodeShape, ModelNode } from '../types'
import { names } from './names'
import { shapes } from './shapes'

export const randomNode = (model: GraphModel): DecoratedNode | undefined => {
  if (model.nodes.length === 0) {
    return
  }
  return model.nodes[Math.floor(Math.random() * model.nodes.length)]
}

const randomEdge = (model: GraphModel): DecoratedEdge | undefined => {
  if (model.edges.length === 0) {
    return
  }
  return model.edges[Math.floor(Math.random() * model.edges.length)]
}

const randomColor = (): string => {
  const colors = [
    '#f94144',
    '#f3722c',
    '#f8961e',
    '#f9c74f',
    '#90be6d',
    '#43aa8b',
    '#577590',
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

const randomShape = (): string => {
  return shapes[Math.floor(Math.random() * shapes.length)]
}

const randomName = () => {
  return `${names[Math.floor(Math.random() * names.length)]} ${
    names[Math.floor(Math.random() * names.length)]
  }`
}

export const addRandomNode = (
  model: GraphModel,
  count: number,
  options?: Partial<ModelNode>
): GraphModel => {
  let content = model.getCurrentContent()
  for (let i = 0; i < count; i++) {
    content = content.addNode({
      label: randomName(),
      ...options,
    })
  }
  return GraphModel.applyContent(model, content)
}

export const addRandomNodeShapes = (
  model: GraphModel,
  count: number,
  options?: Partial<ModelNode>
): GraphModel => {
  let content = model.getCurrentContent()
  for (let i = 0; i < count; i++) {
    content = content.addNode({
      label: randomName(),
      shape: randomShape() as NodeShape,
      ...options,
    })
  }
  return GraphModel.applyContent(model, content)
}

export const addRandomNodeColors = (
  model: GraphModel,
  count: number,
  options?: Partial<ModelNode>
): GraphModel => {
  let content = model.getCurrentContent()
  for (let i = 0; i < count; i++) {
    content = content.addNode({
      color: randomColor(),
      label: randomName(),

      ...options,
    })
  }
  return GraphModel.applyContent(model, content)
}

export const addRandomEdge = (model: GraphModel, count: number): GraphModel => {
  let content = model.getCurrentContent()
  for (let i = 0; i < count; i++) {
    const node1 = randomNode(model)
    const node2 = randomNode(model)
    if (node1 == null || node2 == null) {
      return model
    }
    content = content.addEdge({
      source: node1.id,
      target: node2.id,
      targetArrow: true,
    })
  }
  return GraphModel.applyContent(model, content)
}

export const removeRandomNode = (model: GraphModel): GraphModel => {
  const edge = randomNode(model)
  if (edge == null) {
    return model
  }
  return GraphModel.applyContent(
    model,
    model.getCurrentContent().removeNode(edge.id)
  )
}

export const removeRandomEdge = (model: GraphModel): GraphModel => {
  const edge = randomEdge(model)
  if (edge == null) {
    return model
  }
  return GraphModel.applyContent(
    model,
    model.getCurrentContent().removeEdge(edge.id)
  )
}
