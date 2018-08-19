const LOGICS = {
  Elevator: function construct(object) {
    let state = 0;
    let minX = object.minX, maxX = object.maxX;
    let minY = object.minY, maxY = object.maxY;

    if (minX && maxX) {
      minX += CANVAS_WIDTH / 2;
      maxX += CANVAS_WIDTH / 2;

      return function logic(self) {
        if (state === 0) {
          self.x += 2;
          if (self.x >= maxX) {
            state = 1;
          }
        } else {
          self.x -= 2;
          if (self.x <= minX) {
            state = 0;
          }
        }
      }
    } else if (minY && maxY) {
      minY += CANVAS_HEIGHT / 2;
      maxY += CANVAS_HEIGHT / 2;

      return function logic(self) {
        if (state === 0) {
          self.y += 2;
          if (self.y >= maxY) {
            state = 1;
          }
        } else {
          self.y -= 2;
          if (self.y <= minY) {
            state = 0;
          }
        }
      }
    }
  }
};