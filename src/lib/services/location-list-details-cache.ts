// file system cache for production building process to reduce service invocations to cloud provider.

import { writeFile, readFile } from '../utils/fs-helpers';
import { LOCATION_LIST_DETAILS_CACHE } from '../utils/server-constants';

import { LocationInfo } from '@/types/location';

const cacheFile: string = `${LOCATION_LIST_DETAILS_CACHE}`;

export async function createLocationListDetailsCache(locationListDetails: LocationInfo[]): Promise<void> {
    console.log('Calling create new locationList Cache')
    const cacheFile = `${LOCATION_LIST_DETAILS_CACHE}`;
    try {
        await writeFile(cacheFile, JSON.stringify(locationListDetails), 'utf8');
        console.log('success write file');
    } catch (err) {
        console.error('error ', err);
    }
}

export async function getLocationListDetailsCache(): Promise<LocationInfo[]> {
    console.log('Calling retrive locationList Cache')
    let urlLocationPathCache: LocationInfo[] = [];

    try {
        urlLocationPathCache = JSON.parse(await readFile(cacheFile, 'utf8')) as LocationInfo[];
    } catch (_) {
        /* not fatal */
    }

    return urlLocationPathCache;
}