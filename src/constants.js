export const ROW_HEIGHT = 56;
export const GAP        = 8;
export const MANUAL_SLOTS = 12;

export const MEDIA_TYPES = [
  { value: 'playlist', labelKey: 'type_playlist' },
  { value: 'album',    labelKey: 'type_album'    },
  { value: 'artist',   labelKey: 'type_artist'   },
  { value: 'radio',    labelKey: 'type_radio'    },
];

// order_by values exposed by Music Assistant
export const ORDER_BY_OPTIONS = [
  { value: 'timestamp_added_desc', labelKey: 'order_timestamp_added_desc' },
  { value: 'timestamp_added',      labelKey: 'order_timestamp_added'      },
  { value: 'last_played_desc',     labelKey: 'order_last_played_desc'     },
  { value: 'last_played',          labelKey: 'order_last_played'          },
  { value: 'play_count_desc',      labelKey: 'order_play_count_desc'      },
  { value: 'play_count',           labelKey: 'order_play_count'           },
  { value: 'random',               labelKey: 'order_random'               },
  { value: 'random_less_played',   labelKey: 'order_random_less_played'   },
  { value: 'name',                 labelKey: 'order_name'                 },
  { value: 'name_desc',            labelKey: 'order_name_desc'            },
  { value: 'sort_name',            labelKey: 'order_sort_name'            },
  { value: 'sort_name_desc',       labelKey: 'order_sort_name_desc'       },
  { value: 'year_desc',            labelKey: 'order_year_desc'            },
  { value: 'year',                 labelKey: 'order_year'                 },
  { value: 'artist_name',          labelKey: 'order_artist_name'          },
  { value: 'artist_name_desc',     labelKey: 'order_artist_name_desc'     },
  { value: 'manual',               labelKey: 'order_manual'               },
];
