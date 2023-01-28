export const formatTokenNumber = (number: number) => {
    // tokens have 9 decimals
    let formattedNumber = nFormatter(number / 10**9)

    return formattedNumber
}

function nFormatter(num: number) {
    if (num >= 1000000000) {
       return (num / 1000000000).toFixed(2).replace(/\.0$/, '') + ' B';
    }
    if (num >= 1000000) {
       return (num / 1000000).toFixed(2).replace(/\.0$/, '') + ' M';
    }
    if (num >= 1000) {
       return (num / 1000).toFixed(2).replace(/\.0$/, '') + ' K';
    }
    return num.toFixed(2);
}