import React from 'react'
import { IMatrixElem } from '../../types/types'
import cl from './matrixInputForm.module.css'

interface IsizeMatrix {
	row: number
	col: number
}

type TErrorMessage = {
	rowMessage: string
	colMessage: string
}

interface ImatrixInputFormProps {
	setInitialExpandedMatrix: React.Dispatch<React.SetStateAction<IMatrixElem[][]>>
	setIsMatrixForm:  React.Dispatch<React.SetStateAction<boolean>>
}

const MatrixInputForm: React.FC<ImatrixInputFormProps> = ({
	setInitialExpandedMatrix,
	setIsMatrixForm
}) => {
	const [sizeMatrix, setSizeMatrix] = React.useState<IsizeMatrix>({
		row: 0,
		col: 0,
	})

	const [isSizeForm, setIsSizeForm] = React.useState<boolean>(true)

	const [isError, setIsError] = React.useState<TErrorMessage>({
		rowMessage: '',
		colMessage: '',
	})

	const [matrix, setMatrix] = React.useState<number[][]>([])

	const [constants, setConstants] = React.useState<number[]>([])

	React.useEffect(() => {
		if (isSizeForm) return
		const initialMatrix = Array.from({ length: sizeMatrix.row }, () =>
			Array(sizeMatrix.col).fill(0)
		)

		const initialConstants: number[] = new Array(sizeMatrix.row).fill(0)

		setMatrix(initialMatrix)
		setConstants(initialConstants)
	}, [isSizeForm])

	function wrongInputValue(message: string) {
		return {
			message: message,
		}
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target

		try {
			if (!+value) {
				throw wrongInputValue('значение не может быть нулевым')
			}

			setIsError(prev => ({ ...prev, [`${name}Message`]: '' }))

			setSizeMatrix(prev => ({
				...prev,
				[name]: +value,
			}))
		} catch (error) {
			setIsError(prev => ({ ...prev, [`${name}Message`]: error.message }))
		}
	}

	const handleCreateMatrixForm = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		const { row, col } = sizeMatrix

		if (isError.colMessage || isError.rowMessage) return

		setIsSizeForm(false)
	}

	function handleCreateMatrix(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault()
		const initialMatrix: Array<IMatrixElem[]> = matrix.map((row, rowIndex) =>
			[constants[rowIndex], ...row].map((col, colIndex) => ({
				value: col,
				row: rowIndex,
				col: colIndex,
			}))
		)
		setInitialExpandedMatrix(initialMatrix)
		setIsMatrixForm(false)
	}

	const handleMatrixCreate = (
		indexRow: number,
		indexCol: number,
		value: string
	) => {
		setMatrix(prev => {
			const updatedMatrix = [...prev]
			updatedMatrix[indexRow][indexCol] = +value
			return updatedMatrix
		})
	}

	const handleConstantsCreate = (index: number, value: string) => {
		setConstants(prev => {
			const updatedConstants = [...prev]
			updatedConstants[index] = +value
			return updatedConstants
		})
	}

	return (
		<form className={cl.matrixForm}>
			{isSizeForm ? (
				<>
					<h2 className={cl.title}>Введите размерность матрицы</h2>
					<div className={cl.sizeMatrixForm}>
						<div className={cl.sizeInputs}>
							<label htmlFor='rows'>
								<span>Количество строк: </span>
								<input type='number' name='row' onChange={handleInputChange} />
								{isError.rowMessage ? (
									<p className={cl.errorMessage}>{isError.rowMessage}</p>
								) : null}
							</label>

							<label htmlFor='cols'>
								<span>Количество столбцев: </span>
								<input type='number' name='col' onChange={handleInputChange} />
								{isError.colMessage ? (
									<p className={cl.errorMessage}>{isError.colMessage}</p>
								) : null}
							</label>
						</div>
						<button
							className={`${
								isError.rowMessage || isError.colMessage ? cl.errorBtn : ''
							} ${cl.createMatrixBtn}`}
							onClick={handleCreateMatrixForm}
							type='button'
						>
							Создать
						</button>
					</div>
				</>
			) : (
				<>
					<h2 className={cl.title}>Введите значения матрицы и констант</h2>
					<div className={cl.matrixFormValues}>
						<div className={cl.matrixContainer}>
							<div className={cl.matrixGroup}>
								<h3>Значения матрицы:</h3>
								<div
									className={cl.matrixGrid}
									style={{
										gridTemplateColumns: `repeat(${sizeMatrix.col}, 1fr)`,
									}}
								>
									{Array.from({ length: sizeMatrix.row }, (_, indexRow) => {
										return Array.from(
											{ length: sizeMatrix.col },
											(_, indexCol) => (
												<label
													key={`row: ${indexRow}, col: ${indexCol}`}
													className={cl.matrixLabel}
												>
													x{indexCol + 1}:
													<input
														type='number'
														className={cl.matrixInput}
														onChange={(
															e: React.ChangeEvent<HTMLInputElement>
														) =>
															handleMatrixCreate(
																indexRow,
																indexCol,
																e.target.value
															)
														}
													/>
												</label>
											)
										)
									})}
								</div>
							</div>

							<div className={cl.constantsGroup}>
								<h3>Значения констант:</h3>
								<div className={cl.constantsGrid}>
									{Array.from({ length: sizeMatrix.row }, (_, index) => (
										<label key={`constant-${index}`} className={cl.matrixLabel}>
											<input
												type='number'
												className={cl.matrixInput}
												onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
													handleConstantsCreate(index, e.target.value)
												}
											/>
										</label>
									))}
								</div>
							</div>
						</div>
						<button
							className={cl.createMatrixBtn}
							type='button'
							onClick={handleCreateMatrix}
						>
							Создать
						</button>
					</div>
				</>
			)}
		</form>
	)
}

export default MatrixInputForm
