import base64

index = 0
with open("linesDeduped.txt") as f:
    for line in f:
        index = index + 1
        with open("generatedImages/" + str(index) + ".png", "wb") as fh:
            fh.write(base64.decodebytes(str.encode(line)))