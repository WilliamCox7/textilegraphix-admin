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
    default: return 'An unknown message occured';
  }

}