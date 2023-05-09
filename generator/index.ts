import ApiGenerator from './api'


const main = (command: string[], options: any) => {
  handleInput(command[0], options)
}

// Run everything
const argv = require('minimist')(process.argv.slice(2))
main(argv['_'], argv)

function handleInput(command: string, options: any) {
  switch (command) {
    case 'gen':
      DocGenerator(options)
      break

    default:
      console.log('Unrecognized command:', command)
      break
  }
}

export default async function DocGenerator({
  input,
  output,
}: {
  input: string
  output: string
}) {
  await ApiGenerator(input, output)
  return 'Done'
}
