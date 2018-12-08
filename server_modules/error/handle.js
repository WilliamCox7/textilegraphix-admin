module.exports = function handle(err, id) {

  let details = {
    message: getErrorMessage(id),
    errorId: id,
    error: err
  };

  console.error(details);

  return details;
}

function getErrorMessage(id) {

  switch(id) {
    case '4JOD': return 'There was an error during the users query';
    case 'HIW5': return 'There was an error during the tokens query';
    case 'UK7E': return 'There was an error while clearing all short tokens';
    case 'WPL6': return 'There was an error while deleting a short token';
    case 'UO3E': return 'There was an error while getting a short token';
    case 'PN6Y': return 'There was an error while updating a password';
    case '6RGM': return 'There was an error while getting a products colors';
    case 'QD1V': return 'There was an error while getting a products images';
    case 'MBG0': return 'There was an error while getting a products print area';
    case 'JKL6': return 'There was an error while getting all products';
    case 'EV8N': return 'There was an error while updating the product images';
    case 'RT9M': return 'There was an error while updating the product colors';
    case 'DF2O': return 'There was an error while updating the product';
    case 'BYO0': return 'There was an error while updating the product print area (front)';
    case 'KH1E': return 'There was an error while updating the product print area (back)';
    case 'HOE8': return 'There was an error while deleting a products colors';
    case 'RN8W': return 'There was an error while deleting a products images';
    case 'WTT7': return 'There was an error while creating a new product';
    case 'LI7F': return 'There was an error while creating a products print area (front)';
    case 'NGW5': return 'There was an error while creating a products print area (back)';
    case 'QWD4': return 'There was an error while deleting a product';
    case 'NUC9': return 'There was an error while deleting a products print areas';
    case 'DHP0': return 'There was an error while deleting a products images';
    case 'VBR1': return 'There was an error while deleting a products colors';
    case 'XZ9S': return 'There was an error while writing a file';
    default: return 'An unknown message occured';
  }

}