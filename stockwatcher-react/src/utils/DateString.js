const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1 < 10 ? "0" + (now.getMonth() + 1) : (now.getMonth() + 1);
const date = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
export const todayString = year + "-" + month + "-" + date;

export const findItemWithHref = (href, arr) => {
    for (let obj of arr) {
        if (obj.href === href) {
            return obj.item
        }
    }
    return null
}