const REGEX_1 = /^comp\('([^']+)'\)\.layer\('([^']+)'\)\.effect\('([^']+)'\)\('([^']+)'\);?$/;

const REGEX_2 = /^\$bm_mul\(\$bm_div\(\s*value\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\),\s*comp\('([^']+)'\)\.layer\('([^']+)'\)\.effect\('([^']+)'\)\('([^']+)'\)\);?$/;

export function prepareExpression(
    expr: string,
): any {
    let input = (expr.split('=')[1] || expr).trim();

    const match1 = input.match(REGEX_1);
    const match2 = input.match(REGEX_2);

    if (match1) {
        const args = match1.slice(1);

        return (ctx?: any) => {
            const comp: any = ctx!.comp!;
            const result = comp(args[0])
                .layer(args[1])
                .effect(args[2])
                (args[3]);

            return result;
        }
    } else if (match2) {
        const args = match2.slice(1);

        return (ctx?: any) => {
            const comp: any = ctx!.comp;
            const $bm_div: any = ctx!.$bm_div;
            const $bm_mul: any = ctx!.$bm_mul;
            const value = ctx!.value;

            const result = $bm_mul(
                $bm_div(value, +args[0]),
                comp(args[1]).layer(args[2]).effect(args[3])(args[4])
            );

            return result;
        }
    }

    return null;
}