/**
 * 解碼檔案
 * @param {*} bin - 檔案
 * @returns
 */
export function decodeTriangleMesh(bin) {
  const result = {
    triangleMeshes: [],
  }
  if (bin.byteLength <= 0) {
    return result
  }
  let dataview = new DataView(bin)
  let meshObjCount = new Int32Array(1)
  meshObjCount = dataview.getInt32(0, true)
  let meshObjs = []
  for (let i = 0; i < meshObjCount * 4; i = i + 4) {
    let offset = 1
    let vertexStart = dataview.getInt32((offset + i) * 4, true)
    let vertexEnd = dataview.getInt32((offset + i + 1) * 4, true)
    let indexStart = dataview.getInt32((offset + i + 2) * 4, true)
    let indexEnd = dataview.getInt32((offset + i + 3) * 4, true)
    meshObjs.push({
      vertexStart,
      vertexEnd,
      indexStart,
      indexEnd,
    })
  }
  for (let j = 0; j < meshObjs.length; j++) {
    let vertexLength = meshObjs[j].vertexEnd / 4 - meshObjs[j].vertexStart / 4
    let vertex = new Float32Array(vertexLength)
    let index = []
    let vertexIndex = 0
    for (
      let i = meshObjs[j].vertexStart / 4;
      i < meshObjs[j].vertexEnd / 4;
      i = i + 3
    ) {
      let x = dataview.getFloat32(i * 4, true)
      let y = dataview.getFloat32((i + 1) * 4, true)
      let z = dataview.getFloat32((i + 2) * 4, true)
      vertex[vertexIndex++] = x
      vertex[vertexIndex++] = y
      vertex[vertexIndex++] = z
    }

    for (
      let i = meshObjs[j].indexStart / 4;
      i < meshObjs[j].indexEnd / 4;
      i = i + 3
    ) {
      let p1 = dataview.getInt32(i * 4, true)
      let p2 = dataview.getInt32((i + 1) * 4, true)
      let p3 = dataview.getInt32((i + 2) * 4, true)
      index.push(p1)
      index.push(p2)
      index.push(p3)
    }
    result.triangleMeshes.push({ vertex, index })
  }
  return result
}
