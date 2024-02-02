// I'm not sure what's the mapping of the color IDs, so I'm just using a generic function to get an RGB value based on the colorId number.
// I don't know the max number of the color IDs, the max I get from the API is 39, so I'll assume that the max is 50.
const MAX_COLOR_ID = 50;

export const getColorBasedOnColorId = (colorId: number) => {
	// Map the color ID to RGB values
	const red = Math.round((colorId / MAX_COLOR_ID) * 255);
	const green = Math.round(((MAX_COLOR_ID - colorId) / MAX_COLOR_ID) * 255);
	const blue = Math.round((colorId / MAX_COLOR_ID) * 255);

	// Return the RGB color as a string
	return `rgb(${red}, ${green}, ${blue})`;
};
