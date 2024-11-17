import { IMatrixElem } from '../../types/types'

export function noSolutions(matrix: Array<IMatrixElem[]>, yCols: string[]) {
	const row = matrix[yCols.indexOf('0 =')]
	const hasNonZeroFreeTerm = row[0].value !== 0 
	const allOtherTermsAreZero = row
		.slice(1)
		.every(element => element.value === 0) 

	if (hasNonZeroFreeTerm && allOtherTermsAreZero) {
		return ['Система несовместна и имеет пустое множество решений']
	}

}
