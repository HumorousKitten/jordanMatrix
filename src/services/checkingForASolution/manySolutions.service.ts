import { IMatrixElem } from '../../types/types';

export function manySolutions(matrix: Array<IMatrixElem[]>, xCols: number[], yCols: string[]) {
	const results = new Map();
	const constants = ['α', 'β', 'γ']; 
	const xColsTmp = xCols.map((item, index) => ({ variable: `x${item}`, constant: constants[index] }));


	const isNewFormat = xCols.length > 0 && !yCols.includes('0 =');

	if (isNewFormat) {

			xColsTmp.forEach(({ variable, constant }) => results.set(variable, constant));


			yCols.forEach((item, rowIndex) => {
					let equation = matrix[rowIndex]
							.slice(1) 
							.map((element, colIndex) => {
									const value = element.value;
									if (value === 0) return ''; 

									const { constant } = xColsTmp[colIndex]; 
									const sign = value > 0 ? '-' : '+';
									return `${sign} ${Math.abs(value)}${constant}`;
							})
							.filter(Boolean) 
							.join(' ');


					const freeTerm = matrix[rowIndex][0].value;
					equation = `${freeTerm} ${equation}`;


					results.set(item, equation);
			});

			const finalResult: string[] = []
			results.forEach((value, key) => {
					finalResult.push(`${key} = ${value}`);
			});
			return finalResult
	} else {

			const index = yCols.indexOf('0 =');
			const isValid = (
					index !== -1 && 
					yCols.filter(item => item === '0 =').length === 1 && 
					matrix[index].every(element => element.value === 0) 
			);

			if (isValid) {
					xColsTmp.forEach(({ variable, constant }) => results.set(variable, constant));

					yCols.forEach((item, rowIndex) => {
							if (item !== '0 =') {
									let equation = matrix[rowIndex]
											.slice(1) 
											.map((element, colIndex) => {
													const value = element.value;
													if (value === 0) return '';

													const { constant } = xColsTmp[colIndex];
													const sign = value > 0 ? '-' : '+';
													return `${sign} ${Math.abs(value)}${constant}`;
											})
											.filter(Boolean)
											.join(' ');

									const freeTerm = matrix[rowIndex][0].value;
									equation = `${freeTerm} ${equation}`;

									results.set(item, equation);
							}
					});

					const finalResult: string[] = []
					results.forEach((value, key) => {
							finalResult.push(`${key} = ${value}`);
					});
					return finalResult
			}
	}
}