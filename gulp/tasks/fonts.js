export const fontsCopy = () => {
	return app.gulp.src(app.path.src.fonts, { encoding: false })
		.pipe(app.gulp.dest(app.path.build.fonts))
}
