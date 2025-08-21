import svgSprite from 'gulp-svg-sprite';

export const sprite = () => {
    return app.gulp.src(`${app.path.src.icons}`, {})
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "SVG Color",
                message: "Error: <%= error.message %>"
            }))
        )
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: '../sprites/sprite.svg',
                },
            },
            shape: {
                transform: [
                    {
                        svgo: {
                            js2svg: {pretty: true},
                            plugins: [
                                {
                                    removeAttrs: {
                                        attrs: ['class', 'data-name'],
                                    },
                                },
                                {
                                    removeUselessStrokeAndFill: false,
                                },
                                {
                                    inlineStyles: true,
                                },
                            ],
                        },
                    },
                ],
            },
        }))
        .pipe(app.gulp.dest(`${app.path.build.images}`));
}
