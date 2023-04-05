/**
 * @file Progress functions of RefCard app
 * @author Cuong Duc Nguyen <cuong.duc.nguyen@mni.thm.de>
 */

// Berechne den Durschnitt aller Karteikartenabfrage eines Themas
/**
 * Calculate an average value.
 * @param arr : array
 * @returns int
 */
export function average(arr) {
    if(arr.length == 0) {
      return 0;  
    }
    const result = arr.reduce((total, currentValue) => total = total + currentValue, 0)/arr.length;    
    return result;
  }