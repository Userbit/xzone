import request from "request";
import req from "../../src/forData/request.js";

const entities = ["movie", "torrent"];

describe("testing forData/request.js", () => {
  it("request.js should be required", () => {
    expect(req).toBeObject();
  });

  it.each(entities)("init() should call request.defaults(opts), getOptsFor:%s()", (entity) => {
    const getOptsFor = `getOptsFor:${entity}`;
    const mockObj = { mockProp: "mockVal" };
    const state = { entity, stage: "some stage", log: 1, deleted: true };
    jest
      .spyOn(request, "defaults")
      .mockReturnValueOnce(request)
      .mockReturnValueOnce(request)
      .mockReturnValueOnce(mockObj);
    jest.spyOn(req, getOptsFor).mockReturnValueOnce(mockObj);

    req.init(state);

    expect(request.defaults)
      .toHaveBeenNthCalledWith(
        1,
        expect.toContainAllKeys(["baseUrl", "json", "method", "headers", "gzip"])
      )
      .nthCalledWith(2, expect.toContainAllKeys(["uri", "qs"]))
      .nthCalledWith(3, mockObj);
    expect(req[getOptsFor]).toHaveBeenCalledWith(state);
    expect(req.baseRequest).toStrictEqual(mockObj);
  });

  it("getUri(entity) should return correct uri string for entity", () => {
    const entity = "movie";
    const expectedUri = "/movie/select/";

    expect(req.getUri(entity)).toBe(expectedUri);
  });

  it("getOptsFor:movie() should correct opts", async () => {
    const state = { entity: "movie", stage: "some stage", log: 1 };
    const expectedOpts = { uri: "/movie/select/" };

    expect(req["getOptsFor:movie"](state)).toStrictEqual(expectedOpts);
  });

  it.each([true, false])(
    "getOptsFor:torrent({deleted: %s}) should call baseRequest.defaults(opts) correctly",
    (deleted) => {
      const state = { entity: "torrent", deleted, stage: "some stage", log: 1 };
      const expectedOpts = {
        uri: "/torrent/select/",
        qs: {
          fq: `deleted:${deleted}`,
        },
      };

      expect(req["getOptsFor:torrent"](state)).toStrictEqual(expectedOpts);
    }
  );
});
