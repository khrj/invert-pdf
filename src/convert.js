import Jimp from "jimp"
import { PDFDocument } from "pdf-lib"
import { fromPath } from "pdf2pic"
import { writeFile } from "fs/promises"

const pdfPath = process.argv[2]

const result = await fromPath(pdfPath, {
	density: 300,
	preserveAspectRatio: true,
	width: 2480,
}).bulk(-1, {
	responseType: "buffer",
})

const newPdf = await PDFDocument.create()

const pages = await Promise.all(
	result.map(async pg => {
		const image = await Jimp.read(pg.buffer)
		image.invert()
		return image.getBufferAsync(Jimp.MIME_PNG)
	})
)

for (const page of pages) {
	const imagePage = await newPdf.embedPng(page)
	const newPage = newPdf.addPage()
	newPage.drawImage(imagePage, {
		x: 0,
		y: 0,
		width: newPage.getWidth(),
		height: newPage.getHeight(),
	})
}

const newPdfBytes = await newPdf.save()
await writeFile(process.argv[3], newPdfBytes)

console.log("Done")
