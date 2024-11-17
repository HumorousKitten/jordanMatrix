import React, { FC } from 'react'
import { manySolutions } from '../../services/checkingForASolution/manySolutions.service'
import { noSolutions } from '../../services/checkingForASolution/noSolutions.service'
import { oneSolution } from '../../services/checkingForASolution/oneSolution.service'
import { jordanExclude } from '../../services/jordanExclude.service'
import { selectMatrixElem } from '../../services/selectMatrixElem.service'
import { IMatrixElem, TSelectedMatrixElem } from '../../types/types'
import st from './matrix.module.css'

interface IMatrixList {
	matrix: Array<IMatrixElem[]>
	xCols: number[]
	yCols: string[]
}

interface IMatrixProps {
	matrix: Array<IMatrixElem[]>
	setMatrixSolutions: React.Dispatch<React.SetStateAction<IMatrixList[]>>
	xCols: number[]
	yCols: string[]
}

const Matrix: FC<IMatrixProps> = ({
	matrix,
	setMatrixSolutions,
	xCols,
	yCols,
}) => {
	const [selectedElem, setSelectedElem] = React.useState<TSelectedMatrixElem>({
		row: null,
		col: null,
		xCol: null,
		elem: null,
	})

	const [result, setResult] = React.useState<string[]>([])

	React.useEffect(() => {
		const zeroCount = yCols.filter(item => item === '0 =').length

		// Условие 1: если есть только строки '0 =' (более одной)
		if (zeroCount > 1) {
			setResult(['решение еще не вычислено'])
			return
		}

		// Условие 2: есть ровно одна строка '0 ='
		if (zeroCount === 1) {
			const res = noSolutions(matrix, yCols)
			if (res) {
				setResult(res)
				return
			}
		}

		// Условие 3: xCols.length > 0 и нет строк '0 =' или есть одна строка '0 ='
		if (xCols.length > 0 && (zeroCount === 0 || zeroCount === 1)) {
			const res = manySolutions(matrix, xCols, yCols)
			if (res) {
				setResult(res)
				return
			}
		}

		// Условие 4: xCols пуст, и нет строки '0 ='
		if (xCols.length === 0 && zeroCount === 0) {
			const res = oneSolution(matrix, xCols, yCols)
			setResult(res)
			return
		}

		// На случай, если ни одно из условий не выполнено
		setResult(['решение еще не вычислено'])
	}, [])

	React.useEffect(() => {
		if (selectedElem.row === null) return
		if (!selectedElem.elem) return
		const newMatrix = jordanExclude(matrix, selectedElem)
		console.log(newMatrix)
		setMatrixSolutions(prevState => [
			...prevState,
			{
				matrix:
					yCols[selectedElem.row as number] !== '0 ='
						? newMatrix.map(row => {
								return row.map((colElem, indexCol) => {
									if (colElem.col === selectedElem.xCol) {
										return {
											value: colElem.value,
											row: colElem.row,
											col: +yCols[selectedElem.row as number].replace('x', ''),
										}
									}
									return colElem
								})
						  })
						: newMatrix.map(row =>
								row.filter((_, indexCol) => indexCol !== selectedElem.col)
						  ),
				xCols:
					yCols[selectedElem.row as number] !== '0 ='
						? xCols.map((item, index) =>
								selectedElem.xCol === item
									? +yCols[selectedElem.row as number].replace('x', '')
									: item
						  )
						: xCols.filter(item => item !== selectedElem.xCol),
				yCols: yCols.map((item, index) =>
					index === selectedElem.row ? `x${selectedElem.xCol}` : item
				),
			},
		])
	}, [selectedElem])

	function handleClickMatrixElem(e: React.MouseEvent<HTMLDivElement>) {
		const selectedMatrixElem = selectMatrixElem(e)
		if (!selectedMatrixElem) return
		setSelectedElem(selectedMatrixElem)
	}

	return (
		<main className={st.main}>
			{matrix.length ? (
				<section className={st.jordanTable}>
					<div className={st.nulls}>
						<div></div>
						{yCols.map((item, index) => (
							<div key={'RowId: ' + index}>{item}</div>
						))}
					</div>

					<div
						className={st.matrix}
						style={{
							gridTemplateColumns: `repeat(${matrix[0].length}, 50px)`,
						}}
						onClick={handleClickMatrixElem}
					>
						<div
							className={`${st.gridElement} ${st.constantsColor}`}
							data-noclickelem-attribute={'noClick'}
						>
							C
						</div>

						{xCols.map(item => (
							<div
								className={`${st.gridElement} ${st.constantsCol}`}
								key={'ColId: ' + item}
								data-noclickelem-attribute={'no-click'}
							>
								-x{item}
							</div>
						))}

						{matrix.map((rowElem, indexRow) =>
							rowElem.map((colElem, indexCol) => (
								<div
									className={`${st.gridElement} ${
										selectedElem.row === indexRow &&
										selectedElem.col === indexCol
											? colElem.value === 0
												? st.redBackground // Добавляем стиль с красным фоном
												: st.selectGridElem // Зеленый фон для выбранного элемента
											: ''
									} 
								${!colElem.col ? '' : st.constantsCol}
								${!colElem.col ? st.constantsColor : ''}
							`}
									key={'RowId: ' + indexRow + ' / ' + 'ColId: ' + indexCol}
									data-noclickelem-attribute={null}
								>
									<span style={{ display: 'none' }}>
										<span>
											Координаты матрицы: {indexRow} | {indexCol}
										</span>
										<span>Координаты столбца по xCols: {colElem.col}</span>
									</span>
									{colElem.value}
								</div>
							))
						)}
					</div>
				</section>
			) : null}

			{matrix.length ? (
				<section className={st.stepResult}>
					{result.map((item, index) => (
						<p key={index}>{item}</p>
					))}
					{selectedElem.elem === 0 ? <p className={st.errorSelectedElemMessage}>Нельзя выбирать ноль, попробуйте выбрать другое значение</p> : null}
				</section>
			) : null}
		</main>
	)
}

export default Matrix
