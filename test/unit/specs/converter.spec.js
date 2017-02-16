  import Converter from 'src/assets/converter'
  const EOL = require('os').EOL

  describe('CSV Parser', () => {
    it('Regular CSV text', () => {
      const csvText = `a,b,c${EOL}d,e,f${EOL}g,h,i`
      const ExceptedData = [
        ['a', 'b', 'c'],
        ['d', 'e', 'f'],
        ['g', 'h', 'i']
      ]

      let result = Converter.parseCsv(csvText)
      expect(result).to.deep.equal(ExceptedData)
    })

    it('Regular CSV text with space', () => {
      const csvText = `a, b, c${EOL}d ,e ,f${EOL}  g, h,  i    `
      const ExceptedData = [
        ['a', 'b', 'c'],
        ['d', 'e', 'f'],
        ['g', 'h', 'i']
      ]

      let result = Converter.parseCsv(csvText)
      expect(result).to.deep.equal(ExceptedData)
    })

    it('Empty CSV text', () => {
      const csvText = `,,${EOL},,${EOL},,`
      const ExceptedData = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
      ]

      let result = Converter.parseCsv(csvText)
      expect(result).to.deep.equal(ExceptedData)
    })

    it('Empty CSV text with space', () => {
      const csvText = ` ,   ,  ${EOL},     , ${EOL} ,,   `
      const ExceptedData = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
      ]

      let result = Converter.parseCsv(csvText)
      expect(result).to.deep.equal(ExceptedData)
    })

    it('Mixed CSV text', () => {
      const csvText = `a,   ,${EOL}  ,,f${EOL},h, `
      const ExceptedData = [
        ['a', '', ''],
        ['', '', 'f'],
        ['', 'h', '']
      ]

      let result = Converter.parseCsv(csvText)
      expect(result).to.deep.equal(ExceptedData)
    })
  })

  describe('Markdown Parser', () => {
    it('Regular Markdown', () => {
      const markdownText = `a|b|c${EOL}---|---|---${EOL}d|e|f${EOL}g|h|i`
      const exceptedData = [
        ['a', 'b', 'c'],
        ['d', 'e', 'f'],
        ['g', 'h', 'i']
      ]

      let result = Converter.parseMarkdown(markdownText)
      expect(result).to.deep.equal(exceptedData)
    })

    it('Regular Markdown with border', () => {
      const markdownText = `|a|b|c|${EOL}|---|---|---|${EOL}d|e|f|${EOL}|g|h|i`
      const exceptedData = [
        ['a', 'b', 'c'],
        ['d', 'e', 'f'],
        ['g', 'h', 'i']
      ]

      let result = Converter.parseMarkdown(markdownText)
      expect(result).to.deep.equal(exceptedData)
    })

    it('Markdown with empty row', () => {
      const markdownText = `a|b|c${EOL}---|---|---${EOL}d|e|f${EOL}||`
      const exceptedData = [
        ['a', 'b', 'c'],
        ['d', 'e', 'f'],
        ['', '', '']
      ]

      let result = Converter.parseMarkdown(markdownText)
      expect(result).to.deep.equal(exceptedData)
    })

    it('Markdown with empty col', () => {
      const markdownText = `a|b|c${EOL}---|---|---${EOL}d|e|f${EOL}g||`
      const exceptedData = [
        ['a', 'b', 'c'],
        ['d', 'e', 'f'],
        ['g', '', '']
      ]

      let result = Converter.parseMarkdown(markdownText)
      expect(result).to.deep.equal(exceptedData)
    })

    it('Markdown with sentences content', () => {
      const markdownText = `character|word|sentence${EOL}---|---|---${EOL}a|Apple|I have an Apple${EOL}b|Ball|I have a ball, blue ball`
      const exceptedData = [
        ['character', 'word', 'sentence'],
        ['a', 'Apple', 'I have an Apple'],
        ['b', 'Ball', 'I have a ball, blue ball']
      ]

      let result = Converter.parseMarkdown(markdownText)
      expect(result).to.deep.equal(exceptedData)
    })
  })
