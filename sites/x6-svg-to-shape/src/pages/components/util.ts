export async function readFileAsText(file: File) {
  return new Response(file).text()
}
