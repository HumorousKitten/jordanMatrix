import React from 'react'
import './App.css'
import MatrixInputForm from './components/formMatrix/MatrixInputForm'
import Matrix from './components/matrix/Matrix'
import { IMatrixElem } from './types/types'




interface IMatrixList {
	matrix: Array<IMatrixElem[]>
	xCols: number[]
	yCols: string[]
}

function App() {
	const [isMatrixForm, setIsMatrixForm] = React.useState<boolean>(true)

	const [initialExpandedMatrix, setInitialExpandedMatrix] = React.useState<Array<IMatrixElem[]>>([])

	const [matrixSolutions, setMatrixSolutions] = React.useState<IMatrixList[]>([
		{
			matrix: [],
			xCols: [],
			yCols: [],
		},
	])

	React.useEffect(() => {
		if(!initialExpandedMatrix.length) return
		setMatrixSolutions([
			{
				matrix: initialExpandedMatrix,
				xCols: new Array(
					initialExpandedMatrix.length ? initialExpandedMatrix[0].length - 1 : 0
				).fill(0).map((_, index) => index + 1),
				yCols: new Array(initialExpandedMatrix.length).fill('0 ='),
			},
		]);
	}, [initialExpandedMatrix])






	return (
		<div className='App'>
			{isMatrixForm ? (
				<MatrixInputForm setInitialExpandedMatrix={setInitialExpandedMatrix} setIsMatrixForm ={setIsMatrixForm}/>
			) : (
				matrixSolutions.map((item, index) => (
					<Matrix
						matrix={item.matrix}
						key={index}
						setMatrixSolutions={setMatrixSolutions}
						xCols={item.xCols}
						yCols={item.yCols}
					/>
				))
			)}
		</div>
	)
}

export default App
