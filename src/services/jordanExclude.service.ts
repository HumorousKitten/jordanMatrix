import { IMatrixElem, TSelectedMatrixElem } from '../types/types'
import { roundToTwoDecimalPlaces } from './roundToTwoDecimal.service'

export function jordanExclude(
	matrix: Array<IMatrixElem[]>,
	selectedElem: TSelectedMatrixElem
): Array<IMatrixElem[]> {
	const newMatrix = matrix.map((rowElem, indexRow) => {
		return rowElem
			.map((colElem, indexCol) => {
				if(indexCol === selectedElem.col && indexRow === selectedElem.row){
					return {
						value: roundToTwoDecimalPlaces(
							1 / colElem.value
						),
						row: colElem.row,
						col: colElem.col
					}
				}
				if (indexCol === selectedElem.col) {
					return {
						value:
							colElem.value === 0
								? 0
								: -roundToTwoDecimalPlaces(
										colElem.value / (selectedElem.elem as number)
								  ),
						row: colElem.row,
						col: colElem.col,
					}
				}
				if (indexRow === selectedElem.row) {
					return {
						value:
							colElem.value === 0
								? 0
								: roundToTwoDecimalPlaces(
										colElem.value / (selectedElem.elem as number)
								  ),
						row: colElem.row,
						col: colElem.col,
					}
				}
				return {
					value: roundToTwoDecimalPlaces(
						colElem.value -
							(matrix[indexRow][selectedElem.col as number].value *
								matrix[selectedElem.row as number][indexCol].value) /
								(selectedElem.elem as number)
					),
					row: colElem.row,
					col: colElem.col,
				}
			})
	})

	return newMatrix
}
