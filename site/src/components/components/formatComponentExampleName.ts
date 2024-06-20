const exampleNameRegex = /[A-Z]?[a-z]+|[0-9]+|[A-Z]+(?![a-z])/g;

export const formatComponentExampleName = (
  exampleName: string,
  displayName?: string
) => {
  if (displayName) {
    return displayName;
  }
  const formattedName = exampleName.match(exampleNameRegex);
  return formattedName
    ? formattedName
        .map((part, index) => (index === 0 ? part : part.toLowerCase()))
        .join(" ")
    : exampleName;
};
