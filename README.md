# [dylanaraps.com](http://dylanaraps.com)

My personal website.


### Notes

- The `html` is generated using `pandoc` and a series of markdown files.
- The `css`  is generated using `sassc` and `scss`.
- The `build` script converts the markdown files to html files and generates `css`.
- The `style.scss` file contains a minimal version of Github's `css` styles.
- Hey, I'm lazy.
- Also, fuck `html`. :)


### Dependencies

**Build script**

- `bash`
- `pandoc`
- `sassc`

### Usage

1. Modify `.md` files in `/src`.
2. Modify `.scss` files in `/src/scss`.
3. Run the build script to generate `html`/`css`.
    - `./build`


### Thanks

- https://github.com/sindresorhus/github-markdown-css
