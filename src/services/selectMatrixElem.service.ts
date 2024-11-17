import React from 'react'
import { TSelectedMatrixElem } from '../types/types'

export function selectMatrixElem(e: React.MouseEvent<HTMLDivElement>): TSelectedMatrixElem | undefined {
	const elem = e.target as HTMLElement
	if (!elem) return
	if (elem.hasAttribute('data-noclickelem-attribute')) return
	if (!elem.children.length) return

	const matrixCoordElem = elem.children
		.item(0)
		?.children.item(0)
		?.textContent?.replace('Координаты матрицы: ', '')
		.split('|') as string[]
	const xColCoord = elem.children
		.item(0)
		?.children.item(1)
		?.textContent?.replace('Координаты столбца по xCols: ', '') as string

	return {
		row: +matrixCoordElem[0],
		col: +matrixCoordElem[1],
		xCol: +xColCoord,
		elem: +(elem.childNodes.item(1).textContent as string)
	}
}
