import { base } from "./_backstage.template.js";
import * as e from "../../elements/elements.js";
import { card } from "../../components/card/card.template.js";

export default (data) => {
  const children = [
    card(
      new e.BTNCONTAINER([
        {
          id: "addShow",
          children: [new e.ICON("plus"), "Add Show"],
        },
      ])
    ),
  ];

  for (let i = 0; i < data.shows.length; i++) {
    const showData = data.shows[i],
      event = card(
        new e.FORM({
          method: "POST",
          action: "/backstage/shows/edit",
          class: "style-inputs xhr",
          "data-redirect": "/backstage/shows",
          children: [
            new e.H2(showData.title),
            new e.TEXT({
              name: "title",
              label: "Title",
              value: showData.title,
            }),
            new e.TEXT({
              name: "rss",
              label: "RSS",
              value: showData.rss,
            }),
            new e.TEXT({
              name: "patreon",
              label: "Patreon",
              value: showData.patreon,
            }),
            new e.TEXT({
              name: "spotify",
              label: "Spotify",
              value: showData.spotify,
            }),
            new e.TEXT({
              name: "youTube",
              label: "YouTube",
              value: showData.youTube,
            }),
            new e.TEXT({
              name: "apple",
              label: "Apple",
              value: showData.apple,
            }),
            new e.BTN({
              textContent: "Update Event",
            }),
          ],
        })
      );

    children.unshift(event);
  }

  return base(
    data,
    {
      children: [
        new e.H1([new e.ICON("podcast"), "Shows"]),
        new e.SECTION({
          id: "events",
          children,
        }),
      ],
    },
    [
      new e.MODULE("/backstage/scripts/shows.js"),
      new e.MODULE("/periodic/scripts/xhr/_xhrForm.js"),
    ]
  );
};