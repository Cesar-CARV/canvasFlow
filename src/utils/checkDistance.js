/**
 *
 * @param { object } position1 Vector2 || { x, y }
 * @param { object } position2 Vector2 || { x, y }
 * @returns
 */
export const checkDistance = (position1, position2) => {
  return Math.abs(
    Math.sqrt(
      (position2.x - position1.x) ** 2 + (position2.y - position1.y) ** 2
    )
  );
};
