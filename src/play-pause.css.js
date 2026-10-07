import { css } from "lit";

export const playPauseStyles = css`
  svg[play-pause] {
    height: 100%;
    place-self: center;
    aspect-ratio: 1 / 1;
    padding: 0;
    & path {
      fill: black;
      transition: all 0.3s linear;
    }
    &[play] path {
      d: path(
        "M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134l0 268Z"
      );
      fill: var(--primarycolor, #000);
    }

    &[pause] path {
      d: path("M320-200v-560l80 0-0 560Zm235-0Zm80 0 0-560-80 0l0 560Z");
      fill: #000;
    }
  }
`;
