import React from 'react'
import st from './matrix.module.css'

type TSelectedMatrixElem = {
	row: number | null
	col: number | null
	elem: number | null
}
const Matrix = ({ matrix, setMatrixSolutions, removedCols, origMatrixLength}) => {
	const [selectedElem, setSelectedElem] = React.useState<TSelectedMatrixElem>({
		row: null,
		col: null,
		elem: null,
	})

	React.useEffect(() => {
		if (selectedElem.row === null) return
		jordanExclude()
	}, [selectedElem])

	function roundToTwoDecimalPlaces(num: number) {
		return Math.round(num * 100) / 100
	}

	function jordanExclude() {
		const newMatrix = matrix.map((rowElem, indexRow) => {
			return rowElem
				.map((colElem, indexCol) => {
					if (indexCol === selectedElem.col) return null
					if (indexRow === selectedElem.row) {
						return colElem === 0
							? 0
							: roundToTwoDecimalPlaces(colElem / (selectedElem.elem as number))
					}
					return roundToTwoDecimalPlaces(
						colElem -
							(matrix[indexRow][selectedElem.col as number] *
								matrix[selectedElem.row as number][indexCol]) /
								matrix[selectedElem.row as number][selectedElem.col as number]
					)
				})
				.filter((_, indexCol) => indexCol !== selectedElem.col)
		})

		setMatrixSolutions(prevState => [...prevState, {matrix: newMatrix, removedCols: [...removedCols, selectedElem.col as number - 1]}])
	}

	function handleClickMatrixElem(e: React.MouseEvent<HTMLDivElement>) {
		const elem = e.target as HTMLElement
		if (!elem) return
		if (elem.hasAttribute('data-noclickelem-attribute')) return
		if (!elem.children.length) return
		const matrixCoordElem = elem.children
			.item(0)
			?.textContent?.split('|') as string[]

		setSelectedElem({
			row: +matrixCoordElem[0],
			col: +matrixCoordElem[1],
			elem: +(elem.childNodes.item(1).textContent as string),
		})
	}

	const col = matrix[0].length
	console.log(col)
	const visibleColumnIndices = Array.from({ length: origMatrixLength - 1 }, (_, i) => i + 1).filter(
		index => !removedCols.includes(index - 1)
	)

	return (
		<section className={st.jordanTable}>
			<div className={st.nulls}>
				<div></div>
				{Array.from({ length: matrix.length }, (_, index) => (
					<div key={'RowId: ' + index}>0 =</div>
				))}
			</div>

			<div
				className={st.matrix}
				style={{
					gridTemplateColumns: `repeat(${col}, 50px)`,
				}}
				onClick={handleClickMatrixElem}
			>
				<div
					className={`${st.gridElement} ${st.constantsColor}`}
					data-noclickelem-attribute={'noClick'}
				>
					C
				</div>
				{visibleColumnIndices.map((displayIndex, index) => (
					<div
						className={`${st.gridElement} ${st.constantsCol}`}
						key={'ColId: ' + index}
						data-noclickelem-attribute={'noClick'}
					>
						-x{displayIndex}
					</div>
				))}

				{matrix.map((rowElem, indexRow) =>
					rowElem.map((colElem, indexCol) => (
						<div
							className={`${st.gridElement} ${
								selectedElem.row === indexRow && selectedElem.col === indexCol
									? st.selectGridElem
									: ''
							}
							${!indexCol ? '' : st.constantsCol}
							${!indexCol ? st.constantsColor : ''}
							`}
							key={'RowId: ' + indexRow + ' / ' + 'ColId: ' + indexCol}
							data-noclickelem-attribute={!indexCol ? 'noClick' : null}
						>
							<span style={{ display: 'none' }}>
								{indexRow} | {indexCol}
							</span>
							{colElem}
						</div>
					))
				)}
			</div>
		</section>
	)
}

export default Matrix
