import webpack from "webpack-stream";
import TerserPlugin from "terser-webpack-plugin";

export const js = () => {
	return app.gulp.src(app.path.src.js, { sourcemaps: app.isDev })
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: "JS",
				message: "Error: <%= error.message %>"
			}))
		)
        .pipe(webpack({
            mode: app.isBuild ? 'production' : 'development',
            optimization: {
                minimize: !!app.isBuild,
                minimizer: [new TerserPlugin()],
            },
            output: {
                filename: 'app.min.js',
                publicPath: '/',
            },
            performance: {
                hints: false
            }
        }))
		.pipe(app.gulp.dest(app.path.build.js))
		.pipe(app.plugins.browsersync.stream());
}

// export const js = () => {
//     return app.gulp.src(app.path.src.js, {  encoding: false })
//         .pipe(app.gulp.dest(app.path.build.js))
// }
