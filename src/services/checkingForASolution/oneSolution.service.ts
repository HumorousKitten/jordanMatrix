import { IMatrixElem } from '../../types/types'

export function oneSolution(matrix: Array<IMatrixElem[]>, xCols: number[], yCols: string[]) {
	const results = new Map()

	yCols.forEach((item, rowIndex) => {
		const value = matrix[rowIndex][0].value 
		results.set(item, value)
	})



	const finalResult: string[] = []
	results.forEach((value, key) => {
			finalResult.push(`${key} = ${value}`);
	});
	return finalResult


}
