function formatDate(dateStr: string | null | undefined): string {
	if (dateStr) {
		const dateObj: Date = new Date(dateStr);
		const year: number = dateObj.getFullYear();
		const month: string = ('0' + (dateObj.getMonth() + 1)).slice(-2);
		const day: string = ('0' + dateObj.getDate()).slice(-2);
		return year + '/ ' + month + '/ ' + day + '';
	} else {
		return '';
	}
}
export default formatDate;
