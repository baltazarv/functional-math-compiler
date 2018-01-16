'use strict'; // eslint-disable-line semi
/* eslint-disable no-unused-expressions */

const { List } = require('immutable')
const { expect } = require('chai')
const { Token, lex } = require('./lexer')
const {
	parse,
	parseNatural,
	parseInteger,
	parseFactor,
	parseF2,
	parseTerm,
	parseT2,
	parseExpression,
} = require('./parser')

describe('parsing functions:', () => {

	describe('parseNatural', () => {

		let tokens
		beforeEach(() => {
			tokens = lex('487')
		})

		it('converts number token to number value', () => {
			const value = parseNatural(tokens)
			expect(value).to.be.a('number')
			expect(value).to.equal(487)
		})

		it('throws when given any other token', () => {
			tokens = lex('-')
			const badParse = () => parseNatural(tokens)
			expect(badParse).to.throw()
		})

	})

	describe('parseInteger', () => {

		let tokens
		beforeEach(() => {
			tokens = lex('487').push(null)
		})

		it('converts number token to number PT & remaining tokens', () => {
			const value = parseInteger(tokens)
			expect(value).to.be.an('object')
			expect(value.PT).to.be.an('object')
			expect(List.isList(value.tokens)).to.be.true
			expect(value.PT.value).to.equal(487)
			expect(value.tokens).to.equal(List.of(null))
		})

		it('converts sub token and number token to negative number PT & remaining tokens', () => {
			tokens = lex('-487').push(null)
			const value = parseInteger(tokens)
			expect(value).to.be.an('object')
			expect(value.PT).to.be.an('object')
			expect(List.isList(value.tokens)).to.be.true
			expect(value.PT.value).to.equal(-487)
			expect(value.tokens).to.equal(List.of(null))
		})

		it('throws when given any other token', () => {
			tokens = lex('+62')
			const badParse = () => parseNatural(tokens)
			expect(badParse).to.throw()
		})

	})

	describe('parseFactor', () => {

		let tokens
		beforeEach(() => {
			tokens = lex('487').push(null)
		})

		it('converts number token to number PT & remaining tokens', () => {
			const value = parseFactor(tokens)
			expect(value).to.be.an('object')
			expect(value.PT).to.be.an('object')
			expect(List.isList(value.tokens)).to.be.true
			expect(value.PT.value).to.equal(487)
			expect(value.tokens).to.equal(List.of(null))
		})

		it('converts sub token and number token to negative number PT & remaining tokens', () => {
			tokens = lex('-487').push(null)
			const value = parseFactor(tokens)
			expect(value).to.be.an('object')
			expect(value.PT).to.be.an('object')
			expect(List.isList(value.tokens)).to.be.true
			expect(value.PT.value).to.equal(-487)
			expect(value.tokens).to.equal(List.of(null))
		})

		it('throws when given any other token', () => {
			tokens = lex('+62')
			const badParse = () => parseFactor(tokens)
			expect(badParse).to.throw()
		})

		xit('deals with expressions', () => {
			tokens = lex('(4)')
			const badParse = () => parseFactor(tokens)
			expect(badParse).not.to.throw()
		})

	})

	describe('parseF2', () => {

		let tokens
		beforeEach(() => {
			tokens = lex('487').push(null)
		})

		it('converts irrelevant token to null PT & remaining tokens', () => {
			const value = parseF2(tokens)
			expect(value).to.be.an('object')
			expect(value.PT).to.be.null
			expect(List.isList(value.tokens)).to.be.true
			expect(value.tokens).to.deep.equal(tokens)
		})

		it('converts mul token and number token to PT & remaining tokens', () => {
			tokens = lex('*487').push(null)
			const value = parseF2(tokens)
			expect(value).to.be.an('object')
			expect(value.PT).to.be.an('object')
			expect(Token.Mul.is(value.PT.op)).to.be.true
			expect(value.PT.factor).to.be.an('object')
			expect(value.PT.childF2).to.be.null
			expect(List.isList(value.tokens)).to.be.true
			expect(value.tokens).to.equal(List.of(null))
		})

		it('works for recursive factors', () => {
			tokens = lex('/ 54 * 91').push(null)
			const value = parseF2(tokens)
			expect(value).to.be.an('object')
			expect(value.PT).to.be.an('object')
			expect(Token.Div.is(value.PT.op)).to.be.true
			expect(value.PT.factor).to.be.an('object')
			expect(value.PT.childF2).to.be.an('object')
			expect(List.isList(value.tokens)).to.be.true
			expect(value.tokens).to.equal(List.of(null))
		})

		xit('deals...', () => {
			//
		})

	})

})

xdescribe('parse', () => {

	it('is a function', () => {
		expect(parse).to.be.a('function')
	})

	it(`converts [] to <Nothing>`, () => {
		expect(parse([])).to.deep.equal({})
	})

})
