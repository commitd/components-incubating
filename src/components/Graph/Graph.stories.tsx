import React, { useState } from 'react'
import { Meta } from '@storybook/react'
import { Graph } from '.'
import { ExampleRenderer } from '../../graph/renderer/ExampleRenderer'
import { CytoscapeRenderer } from '../../graph/renderer/CytoscapeRenderer'
import { GraphDebugControl } from '../GraphDebugControl'
import { GraphModel } from '../../graph/GraphModel'
import { Box, ThemeProvider } from '@committed/components'
import {
  addRandomEdge,
  addRandomNode,
  addRandomNodeColors,
  addRandomNodeShapes,
} from '../../graph/data/Generator'
import { ContentModel } from '../../graph/ContentModel'

export default {
  title: 'Components/Graph',
  component: Graph,
} as Meta

const exampleModel = addRandomEdge(
  addRandomNode(GraphModel.createEmpty(), 20),
  15
)

export const Sandbox: React.FC = () => {
  const [model, setModel] = useState(exampleModel)
  return (
    <ThemeProvider>
      <Box mb={2}>
        <GraphDebugControl
          model={model}
          onChange={setModel}
          onReset={() => setModel(exampleModel)}
        />
      </Box>
      <Graph
        model={model}
        onModelChange={setModel}
        renderer={CytoscapeRenderer}
      />
    </ThemeProvider>
  )
}

export const ForceDirectedLayout: React.FC = () => {
  const [model, setModel] = useState(exampleModel)
  return (
    <ThemeProvider>
      <Graph
        model={model}
        onModelChange={setModel}
        renderer={CytoscapeRenderer}
      />
    </ThemeProvider>
  )
}

export const CircleLayout: React.FC = () => {
  const [model, setModel] = useState(
    GraphModel.applyLayout(
      exampleModel,
      exampleModel.getCurrentLayout().presetLayout('circle')
    )
  )
  return (
    <ThemeProvider>
      <Graph
        model={model}
        onModelChange={setModel}
        renderer={CytoscapeRenderer}
      />
    </ThemeProvider>
  )
}

export const ColaForceDirectedLayout: React.FC = () => {
  const [model, setModel] = useState(
    GraphModel.applyLayout(
      exampleModel,
      exampleModel.getCurrentLayout().presetLayout('cola')
    )
  )
  return (
    <ThemeProvider>
      <Graph
        model={model}
        onModelChange={setModel}
        renderer={CytoscapeRenderer}
      />
    </ThemeProvider>
  )
}

export const GridLayout: React.FC = () => {
  const [model, setModel] = useState(
    GraphModel.applyLayout(
      exampleModel,
      exampleModel.getCurrentLayout().presetLayout('grid')
    )
  )
  return (
    <ThemeProvider>
      <Graph
        model={model}
        onModelChange={setModel}
        renderer={CytoscapeRenderer}
      />
    </ThemeProvider>
  )
}

export const NodeShapes: React.FC = () => {
  const [model, setModel] = useState(
    addRandomEdge(addRandomNodeShapes(GraphModel.createEmpty(), 20), 15)
  )
  return (
    <ThemeProvider>
      <Graph
        model={model}
        onModelChange={setModel}
        renderer={CytoscapeRenderer}
      />
    </ThemeProvider>
  )
}

export const NodeColors: React.FC = () => {
  const [model, setModel] = useState(
    addRandomEdge(addRandomNodeColors(GraphModel.createEmpty(), 20), 15)
  )
  return (
    <ThemeProvider>
      <Graph
        model={model}
        onModelChange={setModel}
        renderer={CytoscapeRenderer}
      />
    </ThemeProvider>
  )
}

export const CustomIcons: React.FC = () => {
  const [model, setModel] = useState(
    GraphModel.createWithContent(
      new ContentModel(
        {
          chris: {
            id: 'chris',
            attributes: {},
            label: 'Chris Flatley',
            icon:
              'https://committed.software/static/chris-e5738250e4525dd9c6783ea3802c814f.jpg',
            size: 100,
          },
          stuart: {
            id: 'stuart',
            attributes: {},
            label: 'Stuart Hendren',
            icon:
              'https://committed.software/static/stuart-faed1d5684aa9dd6d7cc20fff9e34e8e.png',
            size: 100,
          },
          jon: {
            id: 'jon',
            attributes: {},
            label: 'Jon Elliot',
            icon:
              'https://committed.software/static/jon-809f2f941386ebb56949c0b3f5dae221.png',
            size: 100,
          },
          steve: {
            id: 'steve',
            attributes: {},
            label: 'Steven Taylor',
            icon:
              'https://committed.software/static/steve-70f3e007ab54a82ef7c7ab8a7989ebc3.jpg',
            size: 100,
          },
          matt: {
            id: 'matt',
            attributes: {},
            label: 'Matt Copas',
            icon:
              'https://committed.software/static/matt-2db182f3e2a621017e7ef4cffda2ee3f.jpg',
            size: 100,
          },
          kristian: {
            id: 'kristian',
            attributes: {},
            label: 'Kristian Aspinall',
            icon:
              'https://committed.software/static/kristian-4508fcd63e07690867e4c39b51bdd685.jpg',
            size: 100,
          },
        },
        {
          e1: {
            id: 'e1',
            attributes: {},
            source: 'chris',
            target: 'stuart',
          },
          e2: {
            id: 'e2',
            attributes: {},
            source: 'stuart',
            target: 'jon',
          },
          e3: {
            id: 'e3',
            attributes: {},
            source: 'kristian',
            target: 'steve',
          },
          e4: {
            id: 'e4',
            attributes: {},
            source: 'matt',
            target: 'kristian',
          },
          e5: {
            id: 'e5',
            attributes: {},
            source: 'jon',
            target: 'matt',
          },
          e6: {
            id: 'e6',
            attributes: {},
            source: 'jon',
            target: 'steve',
          },
          e7: {
            id: 'e7',
            attributes: {},
            source: 'chris',
            target: 'steve',
          },
        }
      )
    )
  )
  return (
    <ThemeProvider>
      <Graph
        model={model}
        onModelChange={setModel}
        renderer={CytoscapeRenderer}
      />
    </ThemeProvider>
  )
}

export const CustomLayout: React.FC = () => {
  const [model, setModel] = useState(
    GraphModel.applyLayout(
      exampleModel,
      exampleModel.getCurrentLayout().customLayout({
        runLayout: (model) => {
          return model.nodes.reduce<Record<string, cytoscape.Position>>(
            (prev, next) => {
              prev[next.id] = {
                x: (next.label.charCodeAt(0) - 65) * 40 + 50,
                y: 200,
              }
              return prev
            },
            {}
          )
        },
        stopLayout: () => {},
      })
    )
  )
  return (
    <ThemeProvider>
      <Graph
        model={model}
        onModelChange={setModel}
        renderer={CytoscapeRenderer}
      />
    </ThemeProvider>
  )
}

export const CustomRenderer: React.FC = () => {
  const [model, setModel] = useState(GraphModel.createEmpty())
  return (
    <Graph model={model} onModelChange={setModel} renderer={ExampleRenderer} />
  )
}

export const LargeGraph: React.FC = () => {
  const [model, setModel] = useState(
    GraphModel.applyLayout(
      addRandomEdge(
        addRandomNode(GraphModel.createEmpty(), 500, {
          shape: 'ellipse',
        }),
        300
      ),
      exampleModel.getCurrentLayout().presetLayout('force-directed')
    )
  )
  return (
    <ThemeProvider>
      <Graph
        model={model}
        onModelChange={setModel}
        renderer={CytoscapeRenderer}
      />
    </ThemeProvider>
  )
}
