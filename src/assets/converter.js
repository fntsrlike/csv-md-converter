const MD_COL_SEPARATOR = '|'
const CSV_COL_SEPARATOR = ','
const EOF = require('os').EOL

let parseMarkdown = function (markdownText) {
  let lines = markdownText.split(EOF)

  // TODO:
  //   1. 判定是否有標題列
  //   2. 判定是否有分格列
  //   3. 透過標題列判定有幾欄
  if (lines.length <= 2) {
    throw new Error('The row(s) of Markdown text are too few to valid.')
  }

  let headerLineText = lines.shift()
  let separatorLineText = lines.shift()

  if (separatorLineText.match(/[^|\-:]/g) !== null) {
    throw new Error('The separator row of Markdown text has invalid character.')
  }
  let separatorLine = splitMarkdownRow(separatorLineText)

  for (let line of separatorLine) {
    if (line.length < 3) {
      throw new Error('The separator row of Markdown text has invalid format.')
    }

    if (line.match(/(-{3,})|(:-{2,})|(-{2,}:)|(:-+:)/) === null) {
      throw new Error('The separator row of Markdown text has invalid format of align sign.')
    }
  }

  let headerLine = splitMarkdownRow(headerLineText)
  let rawRows = lines.slice()
  let dataRows = [headerLine]
  let columnNumber = headerLine.length

  for (let row of rawRows) {
    dataRows.push(splitMarkdownRow(row, columnNumber))
  }

  return dataRows
}

let parseCsv = function (csvText) {
  let rawRows = csvText.split(EOF)
  let dataRows = []

  for (let row of rawRows) {
    let columns = row.split(CSV_COL_SEPARATOR).map((col) => {
      return col.trim()
    })
    dataRows.push(columns)
  }

  return dataRows
}

let dataToMarkdown = function (dataRows) {
  const SEPARATOR_ROW_CHARACTER = '-'
  let headerRow = dataRows[0]
  let bodyRows = dataRows.splice(1)
  let columnsNumber = headerRow.length
  let colsMaxLength = calculateMaxLengthOfEachColumns(columnsNumber, dataRows)
  let separatorRow = colsRightPad(new Array(columnsNumber), colsMaxLength, SEPARATOR_ROW_CHARACTER)
  let mdRows = []

  mdRows.push(colsRightPad(headerRow).join(MD_COL_SEPARATOR))
  mdRows.push(colsRightPad(separatorRow).join(MD_COL_SEPARATOR))

  for (let row of bodyRows) {
    mdRows = colsRightPad(row).join(MD_COL_SEPARATOR)
  }

  return mdRows.join(EOF)
}

let dataToCsv = function (dataRows) {
  let csvRows = []
  for (let row of dataRows) {
    csvRows.push(row.join(CSV_COL_SEPARATOR))
  }

  return csvRows.join(EOF)
}

let markdownToCsv = function (markdownText) {
  return dataToCsv(parseMarkdown(markdownText))
}

let csvToMarkdown = function (csvText) {
  return dataToMarkdown(parseCsv(csvText))
}

let colsRightPad = function (row, colsMaxLength, fillCharacter = '') {
  let columnsNumber = row.length()
  let paddedCols = new Array(columnsNumber)

  for (let i = 0; i < columnsNumber; i++) {
    paddedCols[i] = rightPad(row[i], colsMaxLength[i], fillCharacter)
  }

  return paddedCols
}

let calculateMaxLengthOfEachColumns = function (columnsNumber, dataRows) {
  const DEFAULT_LENGTH = 0
  let colsMaxLength = new Array(columnsNumber).fill(DEFAULT_LENGTH)

  for (let row of dataRows) {
    let colLengths = row.map(function (col) {
      return col.length
    })

    for (let i = 0; i < columnsNumber; i++) {
      colsMaxLength[i] = Math.max(colsMaxLength[i], colLengths[i])
    }
  }

  return calculateMaxLengthOfEachColumns()
}

let trimMarkdownRow = function (row) {
  row = row.replace(/ *\| */g, '|')

  if (row.charAt(0) === MD_COL_SEPARATOR) {
    row = row.substr(1)
  }

  let endAt = row.length - 1
  if (row.charAt(endAt) === MD_COL_SEPARATOR) {
    row = row.substr(0, endAt)
  }
  return row
}

let splitMarkdownRow = function (row, validColumnNumber) {
  row = trimMarkdownRow(row)
  let data = row.split(MD_COL_SEPARATOR, validColumnNumber)
  if (data.length < validColumnNumber) {
    let miss = validColumnNumber - data.length
    let fill = new Array(miss)
    data = data.concat(fill.join(',').split(','))
  }
  return data
}

let rightPad = function (string, fixedLength, fillCharacter = '') {
  let diffLength = fixedLength - string.length

  if (diffLength <= 0) {
    return string
  }

  return string + fillCharacter.repeat(diffLength)
}

export default{
  parseMarkdown,
  parseCsv,
  dataToMarkdown,
  dataToCsv,
  markdownToCsv,
  csvToMarkdown
}
