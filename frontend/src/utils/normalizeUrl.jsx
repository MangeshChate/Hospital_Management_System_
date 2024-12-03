
/**
 * 
 * @param {*} url 
 * @returns return normal url without getting double helpfull during passing through nested data.
 * 
 */


const normalizeUrl = (url) => {

    const segments = url.split('/').filter(Boolean);
    const uniqueSegments = [];
    segments.forEach(segment => {
      if (!uniqueSegments.includes(segment)) {
        uniqueSegments.push(segment);
      }
    });
    
  
    return '/' + uniqueSegments.join('/');
  };

export default normalizeUrl