import { Box, makeStyles } from '@committed/components'
import React from 'react'
import { GraphModel } from '../../graph/GraphModel'
import { GraphRenderer } from '../../graph/types'

export type GraphProps = {
  renderer: GraphRenderer
  model: GraphModel
  onChange?: (model: GraphModel | ((model2: GraphModel) => GraphModel)) => void
}

const useStyles = makeStyles({
  container: {
    backgroundColor: '#FFF',
  },
})

export const Graph: React.FC<GraphProps> = ({
  renderer,
  model,
  onChange = () => {
    // do nothing by default
  },
}) => {
  const classes = useStyles()
  return <Box className={classes.container}>{renderer(model, onChange)}</Box>
}
