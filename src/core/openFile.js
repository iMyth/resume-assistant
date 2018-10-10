let activeDocument

export const getActiveDocument = path => {
  // hack doc functions, debug only
  if (typeof Application === 'undefined') {
    const bookmarks = [
      undefined, 'work_1', 'work_company_1', 'work_time_1',
      'work_position_1', 'work_describe_1', 'work_type_1', 'project_1',
      'userdefined_1', 'user_describe_1', 'user_position_1', 'user_project_1'
    ]
    return {
      Shapes: {
        AddPicture: p => console.log('Shapes.AddPicture => ', p)
      },
      Selection: {
        TypeText: p => console.log('Selection.TypeText =>', p),
        SetRange: p => console.log('Selection.SetRange =>', p),
        Copy: p => console.log('Selection.Copy =>', p),
        Paste: p => console.log('Selection.Paste =>', p),
        InsertParagraph: p => console.log('Selection.InsertParagraph =>', p)
      },
      Bookmarks: {
        Add: p => console.log('Bookmarks.Add =>', p),
        Count: bookmarks.length,
        Item: p => {
          console.log('Bookmarks.Item =>', p)
          return {
            Name: bookmarks[p],
            Select: p => console.log('Bookmarks.Item.Select')
          }
        }
      }
    }
  }
  if (activeDocument && !path) {
    return activeDocument
  }
  if (!path) {
    throw new Error('No file found!')
  }
  if (path && activeDocument) {
    Application.Close()
  }
  activeDocument = Application.Open(path, 0, 0)
  return activeDocument
}

export const close = () => {
  if (!activeDocument) {
    return
  }
  // Application.Save()
  Application.Close()
  activeDocument = null
}
