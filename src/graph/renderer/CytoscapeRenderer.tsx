import React, { useEffect, useMemo, useRef } from 'react'
import { GraphLayout, GraphRenderer } from '../types'
import CytoscapeComponent from 'react-cytoscapejs'
import { useDebouncedCallback } from 'use-debounce'
import {
  Css,
  EdgeDataDefinition,
  ElementDefinition,
  NodeDataDefinition,
  LayoutOptions,
  use,
} from 'cytoscape'
import { forceDirected } from '../layouts/ForceDirected'
import { GraphModel } from '../GraphModel'
import { circle } from '../layouts/Circle'
import { grid } from '../layouts/Grid'
//@ts-ignore
import ccola from 'cytoscape-cola'
import { cola } from '../layouts/Cola'
import {
  CustomLayoutOptions,
  CytoscapeGraphLayoutAdapter,
} from './CytoscapeGraphLayoutAdapter'

use(ccola)
use(CytoscapeGraphLayoutAdapter.register)

export const CytoscapeRenderer: GraphRenderer = (graphModel, onChange) => {
  const layouts: Record<GraphLayout, LayoutOptions> = {
    'force-directed': forceDirected,
    circle,
    grid,
    cola,
    custom: {
      name: CytoscapeGraphLayoutAdapter.LAYOUT_NAME,
      model: graphModel,
      algorithm: graphModel.getCurrentLayout().getLayoutAlgorithm(),
    } as CustomLayoutOptions & LayoutOptions,
  }
  const nodes = graphModel.nodes
  const edges = graphModel.edges
  const cyRef = useRef<cytoscape.Core>()
  const layoutStart = useRef<number>()

  const triggerLayout = useDebouncedCallback((graphLayout: GraphLayout) => {
    if (cyRef.current != null) {
      const l = layouts[graphLayout]
      if (l == null) {
        throw new Error('Layout does not exist')
      }
      cyRef.current.layout(l).run()
    }
  }, 200)

  const dirty = graphModel.getCurrentLayout().isDirty()
  const layout = graphModel.getCurrentLayout().getLayout()

  useEffect(() => {
    if (dirty) {
      triggerLayout.callback(layout)
      onChange(
        GraphModel.applyLayout(
          graphModel,
          graphModel.getCurrentLayout().validate()
        )
      )
    }
  }, [dirty, layout, onChange, graphModel, triggerLayout])

  const elements = useMemo(
    () => [
      ...nodes.map((n) => {
        const node: NodeDataDefinition = {
          id: n.id,
          label: n.label,
        }
        const style: Css.Node = {
          backgroundColor: n.color,
          width: n.size,
          height: n.size,
          shape: n.shape,
          'background-image': n.icon,
          'background-opacity': n.opacity,
          'background-image-opacity': n.opacity,
          'border-opacity': n.opacity,
          'border-color': n.strokeColor,
          'border-width': n.strokeSize,

          // label styles
          'text-background-color': '#FFF',
          'text-background-opacity': 0.7,
          'text-margin-y': -4,
          'text-background-shape': 'roundrectangle',

          // icon styles
          'background-width': '100%',
          'background-height': '100%',
        }
        const element: ElementDefinition = {
          data: node,
          style,
        }
        return element
      }),
      ...edges.map((e) => {
        const edge: EdgeDataDefinition = {
          source: e.source,
          target: e.target,
          label: e.label,
        }
        const css = {}
        const style: Css.Edge = {
          width: e.size,
          'line-color': e.color,
          'target-arrow-shape': 'triangle',
          'target-arrow-color': e.color,
          'target-endpoint': 'outside-to-node-or-label',
          // @ts-ignore
          'line-opacity': e.opacity,
          // FIXME labels require a non-default curve style which isnt working in this version of cytoscape
          //'curve-style': 'straight',

          // label styles
          'text-background-color': '#FFF',
          'text-background-opacity': 0.7,
          'text-margin-y': -4,
          'text-background-shape': 'roundrectangle',
        }
        const element: ElementDefinition = {
          data: edge,
          style,
          css,
          classes: 'bezier',
        }
        return element
      }),
    ],
    [nodes, edges]
  )

  return (
    <CytoscapeComponent
      elements={elements}
      style={{ width: '800px', height: '600px' }}
      cy={(cy): void => {
        cyRef.current = cy
        cy.on('resize', () => {
          triggerLayout.callback(layout)
        })
        cy.on('add remove', 'node', () => {
          triggerLayout.callback(layout)
        })
        cy.on('add remove', 'edge', () => {
          triggerLayout.callback(layout)
        })
        cy.on('layoutstart', () => {
          console.log('Layout started')
          layoutStart.current = Date.now()
        })
        cy.on('layoutstop', () => {
          if (layoutStart.current != null) {
            console.log(`Layout took ${Date.now() - layoutStart.current}ms`)
          }
        })
      }}
    />
  )
}
