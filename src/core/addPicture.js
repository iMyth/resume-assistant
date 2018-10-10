import { getActiveDocument } from './openFile.js'

export const addPicture = imgPath => {
  let doc = getActiveDocument()
  doc.Shapes.AddPicture(imgPath)
}
