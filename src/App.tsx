import React from 'react'
import './App.css'
import Matrix from './components/matrix/Matrix'

const matrixTMP = [
  [1, 3, 0, 1],
  [2, 0, -3, 2],
  [0, 2, 1, 100],
]
const constants = [4, 6, 10]

const combinedMatrix = matrixTMP.map((row, index) => [constants[index], ...row]);

function App() {

  const [matrixSolutions, setMatrixSolutions] = React.useState([
    {
      matrix: combinedMatrix,
      removedCols: [],
      
    }
  ])

	return (
		<div className='App'>
      {matrixSolutions.map((item, index) => <Matrix matrix={item.matrix} key={index} setMatrixSolutions = {setMatrixSolutions} removedCols = {item.removedCols} origMatrixLength={combinedMatrix[0].length}/> )}
		</div>
	)
}

export default App

