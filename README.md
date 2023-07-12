# 1. 기본적인 merge 방식

### Fast forward
예시) Master와 Master에서 바로 나온 Hotfix Branch 등

A 브랜치에서 B 브랜치를 Merge할 때, B Branch가 A Branch 이후의 커밋을 가리키고 있을 때 사용하는 전략

A 브랜치의를 단지 B 브랜치와 동일한 커밋을 가리키도록 이동시킴


### Recursive strategy (3-way Merge)
예시) "Hotfix가 반영된 Master"에 "Hotfix 이전의 Feature 브랜치"를 Merge하는 경우
이 때는 Feature 브랜치가 Master 이후의 커밋을 가리키지 않음 (Master는 이미 Hotfix의 Commit을 가리키고 있음)

이럴때는 두 개의 Commit (Hotfix된 Master, Feature)과 공통 조상 하나(Hotfix 이전의 Master)를 이용하여 3-way Merge를 함  
이 때 3-way Merge의 결과를 별도의 커밋(Merge branch 'feature'라는 새로운 커밋이 생김)으로 만들고 나서 해당 브랜치를 이동시키므로, "Merge Commit" 이라고 부른다

이 때 Merge 하는 두 브랜치에서 같은 파일을 수정한 경우 Conflict가 발생한다.



# 2. Merge와 Rebase
Git에서 한 브랜치에서 다른 브랜치로 합치는 방법은 두 가지가 있는데, 하나는 Merge고 하나는 Rebase다.

### Rebase란?
Master에서 파생된 A, B Branch가 있을 때, A에서 변경된 사항을 Patch로 만들고 이를 다시 B에 적용시키는 방법

우선 두 브랜치의 공통 커밋으로 이동하고 나서, 그 커밋부터 Feature가 작업한 커밋까지 diff를 차례로 만들어 임시저장해놓는다.  
그 후 Feature가 Master가 가리키는 커밋을 가리키게 하고, 아까 저장해 둔 diff를 차례대로 적용한다.  
(공통에서 Feature의 diff 생성 -> Feature 가 Master를 가리키게 함 (Hotfix 내용은 이때 적용) -> 이후 Feature Diff 적용)  
즉 Master -> Hotfix -> Feature의 순으로 저장되는 것이 맞음!!

그리고 checkout master -> merge feature 하여 feature의 작업내역을 저장하면 된다.

1. hotfix 생성 
2. feature 생성
3. (master) merge hotfix
4. (feature) rebase master
6. (master) merge feature


### Rebase의 장점
1. Merge Commit에 비해 히스토리가 깨끗해짐 (Log가 시간순으로 잘 쌓임)
2. 특정 feature branch(A)에서 갈라져 나온 feature branch(B)가 있다고 할 때!
A는 아직 작업이 덜 끝났고, B를 먼저 Master에 병합하고 싶은 경우에 유용함
`$ git rebase --onto master A B`
-> A와 B Branch의 공통 조상까지의 커밋을 B에서 삭제한 후,  
B의 변경 사항만 패치를 만들어 Master(A분기 후 여러 작업이 추가되어도 상관없음) 기반으로 새로 적용

![image](https://github.com/Walkers15/git-example/assets/46189249/cb5c3e41-28f3-4647-9491-864b2f0d328d)


이후 A 의 작업이 끝나면, `git rebase master A` 를 통해 바로 A를 Master에 Rebase 할 수 있음


### Rebase를 사용하기 좋을 때
리모트 브랜치에 커밋을 깔끔하게 적용하고 싶을 때 사용함


### Rebase를 사용하면 안될 때
Rebase는 기존의 커밋을 그대로 사용하지 않고, 내용은 같지만 다른 커밋을 새로 만듦.
그러므로, 이미 원격에 push된 커밋은 리베이스하지 않는 것이 좋음.

만약 누군가!!! 원격 push한 커밋을 되돌리고 리베이스 후 push 했다면, `git pull --rebase` 를 통해 리베한 내용을 내 작업 내역에 미리 반영하여 불상사를 막을 수 있다.

### 그래서 둘중에 뭘 쓸까요?
프로젝트를 함께 진행하는 팀워들과 "히스토리를 어떻게 기록할 것인지?" 를 잘 논의한 후에 정하는 것이 좋다.


# 3. 깃 히스토리를 예쁘게 단장하는 방법, "Squash"

Rebase를 통해 스쿼시를 적용할 수 있다.
스쿼시란 여러 개의 커밋을 하나로 뭉쳐주는 기능을 말하는데, `git rebase -i HEAD~3` 등을 통해 대화형 Rebase 모드로 진입 후 실행해볼 수 있다.
자세한 실행방법은 아래 블로그를 참고!
https://resilient-923.tistory.com/358
```
pick ~~ first commit
s ~~ second squash
s ~~ third squash
```

이렇게 로컬에서 작업 말고, "Squash Merge" 즉 머지할 때 해당 브랜치의 작업 내역을 한꺼번에 축약하여 히스토리를 깔끔하게 관리할 수도 있다.
```
$ git checkout master
$ git merge --squash feature
$ git commit -m "Merge Feature Branch With Squash"
```
이 레포의 Feature 와 Master를 보면, Feature에서 작업했던 (squash commit 1, 2, 3)은 없어지고 "Squashed commit of the following"로 적용된 것을 볼 수 있다!

저렇게 명령어로 실행시키지 않고, PR 적용 시 자동으로 Squash Merge 할 수 있도록 Github Setting을 변경할 수 있다.
Repository Setting에서 "Allow Squash Merging"을 체크해두면, User가 PR 적용 시 어떤 방식을 선택할지 결정할 수 있다.  
[공식문서](https://docs.github.com/ko/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/configuring-commit-squashing-for-pull-requests)



출처  
[공식문서 1](https://git-scm.com/book/ko/v2/Git-%EB%B8%8C%EB%9E%9C%EC%B9%98-Rebase-%ED%95%98%EA%B8%B0)  
[공식문서 2](https://git-scm.com/book/ko/v2/Git-%EB%8F%84%EA%B5%AC-%ED%9E%88%EC%8A%A4%ED%86%A0%EB%A6%AC-%EB%8B%A8%EC%9E%A5%ED%95%98%EA%B8%B0)  
[블로그](https://resilient-923.tistory.com/358)
