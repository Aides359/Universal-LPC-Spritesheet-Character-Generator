with open('imageLines.txt') as f:
    seen = set()
    for line in f:
        if line in seen:
            print(line)
        else:
            seen.add(line)
    with open("linesDeduped.txt", "w") as fh:
        for entry in seen:
            fh.write(entry)