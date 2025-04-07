const copy2dArray = <T>(arr: T[][]) => {
  const copy: T[][] = [];
  for (let i = 0; i < arr.length; i++) {
    const row: any[] = [];
    for (let j = 0; j < arr[i].length; j++) {
      row.push({ ...arr[i][j] });
    }
    copy.push(row);
  }

  return copy;
};

export default copy2dArray;
