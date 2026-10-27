# Cartographic sources and limits

## Historical provinces

`provinces-1868.geojson`: derived from Asukana, **Ryoseikoku_20230626_TSV**, commit `2af72ac9e37ca0c2291a2115122d30917ff34fee`.
https://github.com/Asukana/Ryoseikoku_20230626_TSV
License: **CC0-1.0**, full text in `CC0-provinces.txt`.

The source labels its single dataset **1868**. It contains the 68 traditional provinces and Ezo; it is NOT a temporal series of clan holdings. We sampled zoom-10 raster tiles at 4-pixel intervals, polygonized and simplified them. Small islands may disappear. Names were matched to the raster IDs by geographical sample points recorded in `scripts/province-metadata.json`. Run `scripts/prepare-geography.py` to reproduce the transformation from downloaded sources. Do not treat approximate small-scale geometry as a cadastral source.

For earlier dates, the app explicitly identifies these outlines as a **reference from 1868**, rather than inventing yearly frontiers. Ancient circuits are contextual groupings of this later provincial reference. This does not reconstruct ancient northern frontiers, shōen, competing rights, clan conquests, or fragmented han domains. Political centers and regime texts provide separate dated context. No polygon claims to encode a daimyō's exact possessions. The 1871–1888 prefectural transition is explained rather than drawn with modern boundaries.

## Prefectures and Ryūkyū inset

`prefectures.geojson`: simplified from `dataofjapan/land`, `japan.geojson`.
https://github.com/dataofjapan/land
Original geometry: **Global Map Japan / Geospatial Information Authority of Japan (GSI)**.
https://www.gsi.go.jp/kankyochiri/gm_jpn.html
The upstream README requires attribution to Global Map Japan and specifies an additional reporting requirement for commercial use. See https://github.com/dataofjapan/land/blob/master/README.md and the GSI source terms before commercial reuse.

All 47 current prefectures are included in the file. In the app they are a simplified **contemporary reference**, not exact Meiji or occupation-era boundaries. Okinawa's contemporary island outlines provide a geographic inset for changing Ryūkyū political status; they do not claim to trace the full kingdom or military administration. The Ryūkyū inset uses a separate scale and position, visibly labeled. Distant Pacific islands, colonial possessions, the full historical extent of Ezo and disputed northern territories are outside the displayed area. The view is an atlas of the main archipelago and Ryūkyū, not a statement of sovereign territorial claims.

## Original base outline

`../japan.geo.json`: Natural Earth, via Johan/world.geo.json, public domain.
https://github.com/johan/world.geo.json/blob/master/countries/JPN.geo.json

## Interpretation

Political regime dates are annual navigation anchors. Changes that happened within a year are explained in accompanying prose. Textual contexts: Encyclopaedia Britannica, Japan / History; UNESCO heritage entries linked in story cards. All historical narrative summaries and contextual notes are original French editorial text, not copied source passages. Individual links may provide broader context than a single dated detail.

Every narrative now also has a topical Wikipedia further-reading article, displayed with a French label and its English article language. The 40 cultural additions have original French summaries. Previously supplied contextual sources remain available as secondary references. These reading links do not constitute a claim that every individual detail was verified against the current article revision.
