export function sleep(time: number): Promise<undefined> {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(undefined), time);
    });
}
